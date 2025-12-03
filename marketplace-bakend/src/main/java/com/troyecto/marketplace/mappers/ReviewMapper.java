package com.troyecto.marketplace.mappers;
import com.troyecto.marketplace.dtos.review.ReviewRequest;
import com.troyecto.marketplace.dtos.review.ReviewResponse;
import com.troyecto.marketplace.entities.Review;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;
@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)

public interface ReviewMapper {
   default Review toEntity(ReviewRequest reviewRequest){
        if ( reviewRequest == null ) {
            return null;
        }
        Review review = new Review();
        review.setRating( reviewRequest.getRating() );
        review.setComment( reviewRequest.getComment() );

        return review;
   }
   default ReviewResponse toResponse(Review review){
       if(review == null){
              return null;
       }
         ReviewResponse reviewResponse = new ReviewResponse();
            reviewResponse.setId( review.getId() );
            reviewResponse.setRating( review.getRating() );
            reviewResponse.setComment( review.getComment() );
            reviewResponse.setCreatedDate( review.getCreatedAt());
            reviewResponse.setUpdatedDate( review.getUpdatedAt());
            if(review.getUser() != null){
                reviewResponse.setUserId( review.getUser().getId() );
            }
            if(review.getProduct() != null){
                reviewResponse.setProductId( review.getProduct().getId() );
            }
            return reviewResponse;
   }
   default void updateReviewFromRequest(ReviewRequest reviewRequest, Review review){
        if (reviewRequest == null || review == null) {
            return;
        }
        if (reviewRequest.getRating()!= null) {
            review.setRating(reviewRequest.getRating() );
        }
        if (reviewRequest.getComment() != null) {
            review.setComment( reviewRequest.getComment() );
        }
   }
}
